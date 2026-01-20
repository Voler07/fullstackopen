const Filter = ({
  searchWord,
  handleSearchChange
}) => (
  <div>
        find countries <input value={searchWord} onChange={handleSearchChange}/>
  </div>
) 

export default Filter