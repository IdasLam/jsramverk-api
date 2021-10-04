import { GraphQLString, GraphQLNonNull, GraphQLObjectType} from 'graphql'

const UserType = new GraphQLObjectType({
    name: 'user',
    description: 'This is a user',
    fields: () => ({
        username: {type: GraphQLNonNull(GraphQLString)} 
    })
})

export default UserType