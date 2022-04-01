type Props = {
    personsList: JSX.Element[]
};

const PersonsList = (props: Props) => {
  return (
    <div>
        <p style={{fontWeight: 'bold', margin: '10px', marginTop: '0px'}}>
            Personnel
        </p>
        <ul>
            {props.personsList}
        </ul>
    </div>
  )
}

export default PersonsList