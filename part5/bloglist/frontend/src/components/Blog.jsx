import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Divider
} from '@mui/material'

const Blog = ({ blog, user, updateLikes, removeBlog }) => {
  if (!blog) {
    return null
  }

  const showRemoveButton = user && blog.user.username === user.name

  return (
    <Card sx={{ maxWidth: 500, mb: 2, boxShadow: 3 , marginTop: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {blog.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          by {blog.author}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" component="a" href={blog.url} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            {blog.url}
          </Typography>
        </Box>

        <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic' }}>
          Added by: {blog.user.username}
        </Typography>
      </CardContent>

      <Divider variant="middle" />

      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
            {blog.likes} likes
          </Typography>
          {user && (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => updateLikes(blog)}
            >
              Like
            </Button>
          )}
        </Box>

        {showRemoveButton && (
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => {
              if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
                removeBlog(blog)
              }
            }}
          >
            Remove
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default Blog