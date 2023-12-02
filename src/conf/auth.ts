const redirectUri = process.env.NODE_ENV === 'production' ? 'https://chiral-phonon-material-database.vercel.app/api/authCallback' : 'http://localhost:3000/api/authCallback'

export {
  redirectUri
}