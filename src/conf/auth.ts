const redirectUri = process.env.NODE_ENV === 'production' 
? 'https://materialsfingerprint.com/api/authCallback' 
: 'http://localhost:3000/api/authCallback'

const adminEmail = '1756127061@qq.com'

export {
  redirectUri,
  adminEmail
}