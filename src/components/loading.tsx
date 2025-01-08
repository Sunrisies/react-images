import '@/assets/styles/loading.scss'

export default () => {
  return (
    <div className="loader-container">
      <div className="main">
        <div className="up">
          <div className="loaders">
            {[...Array(10)].map((_, index) => (
              <div key={index} className={`loader`}></div>
            ))}
          </div>
          <div className="loadersB">
            {[...Array(9)].map((_, index) => (
              <div key={index} className={`loaderA`}>
                <div className={`ball ball${index}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
