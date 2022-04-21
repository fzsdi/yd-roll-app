import { useState } from 'react';
import configData from "./config.json";

type Props = {
    postPersons: (url: string, id: number, fullName: string) => Promise<any>
};

const AddPerson = (props: Props) => {

    const [fullName, setFullName] = useState('');
    const [id, setId] = useState('');

  return (
    <div className='box-add'>
        <input id='input-id' required
            type='text' placeholder='Id'
            value={id} 
            onChange={(e) => setId(e.target.value)}></input>
        <input required
            type='text' placeholder='Name'
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}></input>
        <button onClick={() => props.postPersons(configData.BASE_URL + "/persons", parseInt(id), fullName)}>+</button>
    </div>
  )
}

export default AddPerson;