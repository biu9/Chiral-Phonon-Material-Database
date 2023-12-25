
export function concurrentControl<T>(requests:Array<() => Promise<T>>,max:number) {
  return new Promise((resolve,reject) => {
    const tasks = [...requests];
    const res: any = [];
    let running = 0;

    const runTask = async () => {
        if(tasks.length === 0) {
            if(running === 0) {
                resolve(res);
            }
        } else if(tasks.length > 0 && running < max) {
            const task = tasks.shift() as () => Promise<T>
            running++;
            const data = await task();
            running--;
            res.push(data);
            runTask();
        }
    }

    for(let i=0;i<max;i++) {
        runTask();
    }
})
}