import React from 'react';
import './textinput.css';
const TextInput = 
  ({
    defaultValue, placeholder, value, onChangeText, multiline, password, width, padding, margin
  }: 
    {
      defaultValue?: string, placeholder?: string, value?: string, onChangeText?: (arg0: string) => void, 
      multiline?: boolean, password?: boolean, width?: string, padding?: string, margin?: string, 
    }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => 
    {
      if (onChangeText === undefined)
        return;
      onChangeText(event.target.value);
    };

    if (multiline)
    {
      return (
        <textarea style={{width: width || 'auto', margin: margin || 'auto'}}
          className='native-base-clone-input' defaultValue={defaultValue} value={value} onChange={handleChange}/>
      );
    }

    return (
      <input style={{padding: padding || 'auto', margin: margin || 'auto'}}
        className='native-base-clone-input' type={password ? 'password' : 'text'} value={value}
        defaultValue={defaultValue} onChange={handleChange} width={width || 'auto'} placeholder={placeholder}/>
    );
  };

export default TextInput;