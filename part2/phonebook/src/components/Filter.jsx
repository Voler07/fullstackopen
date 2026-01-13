const Filter = ({
  searchWord,
  handleSearchChange
}) => (
  <div>
        filter shown with <input value={searchWord} onChange={handleSearchChange}/>
  </div>
) 

export default Filter