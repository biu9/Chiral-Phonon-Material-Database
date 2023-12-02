const Component1 = () => {
  const handleClick = () => {
    // fetch xxx api
    /// xxx api重定向到abc.com
  }
  
  return (
    <>
      <div onClick={handleClick}></div>
    </>
  )
}

const Component2 = () => {
  return (
    <>
      <a href="abc.com">xxx</a>
    </>
  )
}