type Props = {
    personsList: JSX.Element[]
};

const PersonsList = (props: Props) => {
  return (
    <div>
        <ul className="ul-list">
            {props.personsList}
        </ul>
    </div>
  )
}

export default PersonsList;