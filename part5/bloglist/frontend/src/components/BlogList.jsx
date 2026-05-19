import Blog from './Blog'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper }
  from '@mui/material'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <TableContainer component={Paper} sx={{ marginTop: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Blogs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map(blog =>
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList