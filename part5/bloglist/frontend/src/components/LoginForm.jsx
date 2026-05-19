import { TextField, Button } from '@mui/material'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label='username'
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <TextField
            label='password'
            type="password"
            value={password}
            onChange={handlePasswordChange}
            style={{ marginTop: 10 }}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm