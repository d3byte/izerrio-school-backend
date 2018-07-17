const URL = process.env.NODE_ENV === 'test' ? 
'mongodb://localhost:27017/izerrio_school_test' :
'mongodb://localhost:27017/izerrio_school'

export default URL