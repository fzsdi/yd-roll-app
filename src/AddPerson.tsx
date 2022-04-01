import React from 'react'
type Props = {
    id: string,
    setId: React.Dispatch<React.SetStateAction<string>>,
    fullName: string,
    setFullName: React.Dispatch<React.SetStateAction<string>>,
    postPersons: (url: string, id: number, fullName: string) => Promise<any>
};

const BASE_URL = 'http://localhost:5053/persons';

const AddPerson = (props: Props) => {
  
  const onSubmit = (e: React.ChangeEvent<any>) => {
      e.preventDefault();
  };
  return (
    <form onSubmit={onSubmit}>
        <input required style={{margin: '10px'}}
            type='text' placeholder='ID'
            value={props.id} 
            onChange={(e) => props.setId(e.target.value)}></input>
        <input required style={{margin: '10px', marginLeft: '0px'}}
            type='text' placeholder='Full name'
            value={props.fullName} 
            onChange={(e) => props.setFullName(e.target.value)}></input>
        <button onClick={() => props.postPersons(BASE_URL, parseInt(props.id), props.fullName)}>Add person</button>
    </form>
  )
}

export default AddPerson