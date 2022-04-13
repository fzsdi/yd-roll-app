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
        <input className='input-reg' id='id-inp' required
            type='text' placeholder='Id'
            value={props.id} 
            onChange={(e) => props.setId(e.target.value)}></input>
        <input className='input-reg' id='name-inp' required
            type='text' placeholder='Name'
            value={props.fullName} 
            onChange={(e) => props.setFullName(e.target.value)}></input>
        <button className='btn-reg' onClick={() => props.postPersons(BASE_URL, parseInt(props.id), props.fullName)}>+</button>
    </form>
  )
}

export default AddPerson