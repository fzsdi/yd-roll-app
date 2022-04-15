type Props = {
    personsList: JSX.Element[]
};

const PersonsList = (props: Props) => {
  return (
    <div>
        <ul>
            {props.personsList}
        </ul>
    </div>
  )
}

export default PersonsList