import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useAdvancedSymmetry,useSearchPropsDispatch,useSearchProps } from './searchPropsContext';

const suggestions = ['Option 1', 'Option 2', 'Option 3']; // 这里是菜单项，可以根据需要自定义

const AutoCompleteTextArea: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const advancedSymmetry = useAdvancedSymmetry();
  const searchProps = useSearchProps();
  const setSearchProps = useSearchPropsDispatch();

  return (
    <div className="w-full">
      <Autocomplete
        freeSolo
        options={advancedSymmetry}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          setSearchProps({
            ...searchProps,
            filter: {
              ...searchProps.filter,
              symmetry: [parseInt(newInputValue)]
            }
          })
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant='outlined'
            style={{
              width: '30%'
            }}
            size='small'
          />
        )}
      />
    </div>
  );
};

export default AutoCompleteTextArea;