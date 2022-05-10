import { useState, useEffect, useContext } from 'react';
import AddPerson from './AddPerson';
import PersonsList from './PersonsList';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import './Content.css';
import configData from "./Config.json";
import { UserContext } from './UserContext';
import { LoginContext } from './LoginContext';

type Props = {
    onRefresh(): void;
    socket: WebSocket
};

interface Person { id: number, fullName: string, isPresent: boolean };

const Content = (props: Props) => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // const socket: any = (window as any).Socket;
    const userRole = useContext(UserContext);
    const username = useContext(LoginContext);

    function getToken() : string {
        const myStorage = window.sessionStorage;
        const userToken = myStorage.getItem('Token');
        return userToken!;
    }

    function isUnauth() {
        const myStorage = window.sessionStorage;
        myStorage.removeItem('Token');
        window.location.reload();
    }

    async function getPersons () {
        setIsLoading(true);
        try {
            const response = await fetch(configData.BASE_URL + "/persons");
            const persons = await response.json();
            setPersons(persons);
        } catch(err) {
            alert(err);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getPersons();
        // props.onRefresh = () => getPersons();
    }, []);

    props.socket.onmessage = (event) => {
        getPersons();
    };

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
                        case configData.STATUS_CODES.UNAUTHORIZED:
                            isUnauth();
                            throw Error(configData.MESSAGES.UNAUTHORIZED_ERR);
                        case configData.STATUS_CODES.FORBIDDEN:
                            throw Error(configData.MESSAGES.FORBIDDEN_ERR);
                        case configData.STATUS_CODES.CONFLICT:
                            throw Error(`A person with id ${id} already exists.`);
                        case configData.STATUS_CODES.BAD_REQUEST:
                            throw Error(configData.MESSAGES.BAD_REQUEST_ERR);
                        default:
                            throw Error(configData.MESSAGES.WENT_WRONG_ERR);
                    }
                }
                const personsList = [...persons, newPerson];
                setPersons(personsList);
            } catch(err) {
                alert(err);
            }
        } else {
            alert(configData.MESSAGES.NULL_ERR);
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
                    case configData.STATUS_CODES.NOT_ALLOWED:
                        throw Error(configData.MESSAGES.NOT_ALLOWED_ERR);
                    case configData.STATUS_CODES.UNAUTHORIZED:
                        isUnauth();
                        throw Error(configData.MESSAGES.UNAUTHORIZED_ERR);
                    default:
                        throw Error(configData.MESSAGES.WENT_WRONG_ERR);
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
                    case configData.STATUS_CODES.UNAUTHORIZED:
                        isUnauth();
                        throw Error(configData.MESSAGES.UNAUTHORIZED_ERR);
                    default:
                        throw Error(configData.MESSAGES.WENT_WRONG_ERR);
                }
            }
            const personsList = persons.filter((person) => person.id !== id);
            setPersons(personsList);
        } catch(err) {
            alert(err);
        }
    }

    function Options(person: Person, isUser: boolean) {
        return (
            <div className='div-options'>
                {!isUser &&
                    <button className='button-delete' onClick={() => deletePersons(`${configData.BASE_URL}/persons/${person.id}`, person.id)}>
                            <i className='fa fa-trash-o'></i>
                    </button>
                }
                <input className='checkbox-update'
                    type='checkbox'
                    disabled={isUser}
                    checked={person.isPresent}
                    onChange={() => updatePersons(`${configData.BASE_URL}/persons/${person.id}`, person.id)}>
                </input>
            </div>
        );
    }

    const personsList = persons.map((person) =>
        <div className='div-list'>
            <div className='div-title'>
                <li className='li-show' key={person.id}>
                        ({person.id}) {person.fullName}
                </li>
            </div>
            {userRole === "Admin" &&
                // Options(person, false)
                <div className='div-options'>
                    <button className='button-delete' onClick={() => deletePersons(`${configData.BASE_URL}/persons/${person.id}`, person.id)}>
                            <i className='fa fa-trash-o'></i>
                    </button>
                    <input className='checkbox-update'
                        type='checkbox'
                        checked={person.isPresent}
                        onChange={() => updatePersons(`${configData.BASE_URL}/persons/${person.id}`, person.id)}>
                    </input>
                </div>
            }
            {userRole === "User" && 
                // Options(person, true)
                <div className='div-options'>
                    <input className='checkbox-update'
                        type='checkbox'
                        disabled={!(username == person.id)}
                        checked={person.isPresent}
                        onChange={() => updatePersons(`${configData.BASE_URL}/persons/${person.id}`, person.id)}>
                    </input>
                </div>
            }
        </div>
    );
            
    return (
        <div>
            <Header />
            <div className='div-content'>
                {userRole === "Admin" &&
                    <div className='div-add'>
                        <AddPerson
                            postPersons={postPersons}
                        />
                    </div>
                }
                { isLoading ? <LoadingSpinner/> : <PersonsList personsList={personsList} /> }
            </div>
        </div>
    );
}

export default Content;