import { GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLList} from 'graphql'

const DocumentType = new GraphQLObjectType({
    name: 'document',
    description: 'This is a document',
    fields: () => ({
        title: {type: GraphQLNonNull(GraphQLString)},
        content: {type: GraphQLNonNull(GraphQLString)}, 
        _id: {type: GraphQLNonNull(GraphQLString)},
        access: {type: GraphQLList(GraphQLString)}
    })
})

export default DocumentType