import { useState, useEffect } from 'react'
import AddPerson from './AddPerson';
import PersonsList from './PersonsList';
import Header from './Header';
import './Content.css'

interface Person { id: number, fullName: string, isPresent: boolean };
const BASE_URL = 'https://localhost:443/persons';
const CONFLICT = 409;
const UNAUTHENTICATED = 401;
const BAD_REQUEST = 400;
const UNAUTHENTICATED_ERR = 'You do not have the authority to perform this action.'
const BAD_REQUEST_ERR = 'Server cannot response.';
const WENT_WRONG_ERR = 'Something went wrong :(';
const NULL_ERR = 'Please enter id and full name.';

const Content = () => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [fullName, setFullName] = useState('');
    const [id, setId] = useState('');

    function getToken() : string {
        const myStorage = window.sessionStorage;
        const userToken = myStorage.getItem('Token');
        return userToken!;
    }

    useEffect(() => {
        const getPersons = async () => {
            const response = await fetch(BASE_URL);
            const persons = await response.json();
            setPersons(persons);
        }
        getPersons();
    }, []);

    async function postPersons(url: string, id: number, fullName: string) {
        if (!isNaN(id) && fullName !== "") {
            const newPerson = {
                id, fullName, isPresent: false
            };
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': getToken()
                    },
                    body: JSON.stringify(newPerson)
                });
                if (!response.ok) {
                    switch(response.status) {
                        case UNAUTHENTICATED:
                            throw Error(UNAUTHENTICATED_ERR);
                        case CONFLICT:
                            throw Error(`A person with id ${id} already exists.`);
                        case BAD_REQUEST:
                            throw Error(BAD_REQUEST_ERR);
                        default:
                            throw Error(WENT_WRONG_ERR);
                    }
                }
                const personsList = [...persons, newPerson];
                setPersons(personsList);
            } catch(err) {
                alert(err);
            }
        } else {
            alert(NULL_ERR);
        }
    }

    async function updatePersons(url: string, id: number) {
        const listPersons = persons.map((person) => person.id === id ? { ...person,
            isPresent: !person.isPresent} : person);
        const updatedPerson = listPersons.filter((person) => person.id === id);
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': getToken()
                },
                body: JSON.stringify(updatedPerson[0])
            });
            if (!response.ok) {
                switch(response.status) {
                    case UNAUTHENTICATED:
                        throw Error(UNAUTHENTICATED_ERR);
                    default:
                        throw Error(WENT_WRONG_ERR);
                }
            }
            setPersons(listPersons);
        } catch(err) {
            alert(err)
        }
    }

    async function deletePersons(url: string, id: number) {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': getToken()
                }
            });
            if (!response.ok) {
                switch(response.status) {
                    case UNAUTHENTICATED:
                        throw Error(UNAUTHENTICATED_ERR);
                    default:
                        throw Error(WENT_WRONG_ERR);
                }
            }
            const personsList = persons.filter((person) => person.id !== id);
            setPersons(personsList);
        } catch(err) {
            alert(err);
        }
    }

    const personsList = persons.map((person) =>
        <div className='div-list'>
            <div className='div-title'>
                <li className='li-show' key={person.id}>
                        {person.id}) {person.fullName}
                </li>
            </div>
            <div className='div-options'>
                <button className='button-delete' onClick={() => deletePersons(`${BASE_URL}/${person.id}`, person.id)}>
                        <i className='fa fa-trash-o'></i>
                </button>
                <input className='checkbox-update'
                    type='checkbox'
                    checked={person.isPresent}
                    onChange={() => updatePersons(`${BASE_URL}/${person.id}`, person.id)}></input>
            </div>
        </div>
    );

    return (
        <div>
            <Header />
            <div className='div-content'>
                <div className='div-add'>
                    <AddPerson
                        id={id}
                        setId={setId}
                        fullName={fullName}
                        setFullName={setFullName}
                        postPersons={postPersons}
                    />
                </div>
                <PersonsList
                    personsList={personsList}
                />
            </div>
        </div>
    );
}

export default Content;