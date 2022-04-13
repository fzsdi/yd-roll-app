type Props = {
    personsList: JSX.Element[]
};

const PersonsList = (props: Props) => {
  return (
    <div id="prsnl-div">
        <p>
            Personnel
        </p>
        <ul>
            {props.personsList}
        </ul>
    </div>
  )
}

export default PersonsList