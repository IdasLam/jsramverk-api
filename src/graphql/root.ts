import UserType from "./types/users";
import DocumentType from "./types/documents";

import * as document from '../database/models/documents'
import * as users from '../database/models/users'
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";

const RootQueryType = new GraphQLObjectType({
    name: 'query',
    description: 'Root Query',
    fields: () => ({
        document: {
            type: DocumentType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, args) => {
                let doc = await document.findDocument(args.id)

                return doc
            }
        },
        // documents: {
        //     type: DocumentType,
        //     resolve: async (parent, args) => {
        //         let doc = await document.allDocuments(args.username)

        //         return doc
        //     }
        // },
        user: {
            type: UserType,
            args: {
                username: {type: GraphQLNonNull(GraphQLString)} 
            },
            resolve: async (parent, args) => {
                let user = await users.findUser(args.username)

                return user
            }
        }
    })
})

export default RootQueryType