type uploadData = {
  ID: string,
  pam: boolean,
  chiral: string,
  data: {
    poscar: string,
    band: string,
    dos: string,
    nacdos: string,
    cif: string
  }
}

/**
 * 批量处理材料数据
 */
export function processFiles(files:FileList):Promise<uploadData[]> {

  return new Promise((resolve,reject) => {
    const processResult:uploadData[] = [];
    let running = 0;
    
    for(let i=0;i<files.length;i++) {
      running++;
      const reader = new FileReader();
      reader.onload = function(event) {
        const fileContent = event.target?.result || '';

        const tmp = files[i].name.split('.')[0].split('_');
        const ID = tmp[0].split('-')[1];
        const pam = tmp[1].includes('a') ? false : true;
        const chiral = tmp[2];
        let isExisted = false;

        // 删除docsproj后缀proj
        let fileType = files[i].name.split('.')[1];
        if(fileType.includes('proj')) {
          fileType = fileType.split('proj')[0];
        }

        for(let i=0;i<processResult.length;i++) {
          if(processResult[i].ID === ID) {
            processResult[i].data[fileType as keyof uploadData['data']] = fileContent as string;
            isExisted = true;
            break;
          }
        }

        if(!isExisted) {
          let tmpBody:uploadData = {
            ID,
            pam,
            chiral,
            data: {
              poscar: '',
              band: '',
              dos: '',
              nacdos: '',
              cif: ''
            }
          }
          tmpBody['data'][fileType as keyof uploadData['data']] = fileContent as string;
          processResult.push(tmpBody);
        }

        running--;
        if(running === 0) {
          resolve(processResult);
        }
      }

      reader.readAsText(files[i]);
    }
  })
}