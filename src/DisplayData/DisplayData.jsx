import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";

const QUERY_ALL_USERS = gql`
    query GetAllUsers { 
        users {
            id
            name
            age
            username
        }
    }
`
const QUERY_ALL_MOVIES = gql`
    query GetAllUsers { 
        movies {
            name
        }
    }
`

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
        name,
        yearOfPublication
    }
  }
`

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) { 
    createUser(input: $input) {
        name
        id
    }
  }
`

const DisplayData = () => {
    const [movieSearch, setMovieSearch] = useState("")
    const [userData, setUserData] = useState({
        name: "",
        username: "",
        age: 18,
        nationality: ""
    })
    const { data, loading, error, refetch } = useQuery(QUERY_ALL_USERS)
    const { data: moviesData } = useQuery(QUERY_ALL_MOVIES)

    const [fetchMovie, { data: movieSearchedData, error: movieError }] = useLazyQuery(GET_MOVIE_BY_NAME)

    const [createUser] = useMutation(CREATE_USER_MUTATION)

    const handleChange = (event) => {
        if(event.target.name === "nationality") {
            event.target.value = event.target.value.toUpperCase();
        }
        setUserData({...userData, [event.target.name]: event.target.value})
    }

    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <div>
            <div>
                <input onChange={handleChange} name="name" type="text" placeholder="Name" />
                <input onChange={handleChange} name="username" type="text" placeholder="User Name" />
                <input onChange={handleChange} name="age" type="number" placeholder="Age" />
                <input onChange={handleChange} name="nationality" type="text" placeholder="Nationality" />
                <button
                  onClick={() => {
                    createUser({variables: {input: {...userData, age: Number(userData.age)}}})
                    refetch()
                  }}
                >Create User</button>
            </div>
            {
                data.users && data.users.map((user) => {
                    return (
                        <div>
                            <h1>Name: {user.name}</h1>
                            <h1>User Name: {user.username}</h1>
                            <h1>Age: {user.age}</h1>
                        </div>
                    )
                })
            }

            {
                moviesData?.movies && moviesData?.movies?.map((movie) => {
                    return (
                        <div>
                            <h1>Movie: {movie.name}</h1>
                        </div>
                    )
                })
            }

            <div>
                <input value={movieSearch} type="text" placeholder="Interstellar..." onChange={(event) => setMovieSearch(event.target.value)} />
                <button onClick={()=> {
                    fetchMovie({
                        variables: {
                            name: movieSearch
                        }
                    })
                }}>Fetch Data</button>
                <div>
                    {
                        movieSearchedData && 
                        <div>
                            <h1>Movie Name: {movieSearchedData.movie.name}</h1>
                            <h1>Movie Year: {movieSearchedData.movie.yearOfPublication}</h1>
                        </div>
                    }
                 {
                    movieError && <div>There was an error fetching movie.</div>
                 }
                </div>
            </div>
        </div>
    )
}

export default DisplayData;