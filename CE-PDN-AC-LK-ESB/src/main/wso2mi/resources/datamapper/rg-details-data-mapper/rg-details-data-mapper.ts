import * as dmUtils from "./dm-utils";
declare var DM_PROPERTIES: any;

/*
* title : "root",
* inputType : "JSON",
*/
interface Root {
    status: string
    data: {
        code: string
        name: string
        metadata: {
            description: string
            primary_contact_person: string
            maintainer: string
            page: string
            website: string
        }
        taxonomy: string
    }
}

/*
* title : "root",
* outputType : "JSON",
*/
interface OutputRoot {
    status: string
    data: {
        code: string
        name: string
        description: string
        primary_contact_person: string
        maintainer: string
        page: string
        website: string
    } 
}



/**
 * functionName : map_S_root_S_root
 * inputVariable : inputroot
*/
export function mapFunction(input: Root): OutputRoot {
    return {
        status: input.status,
        data: {
            code: "vision",
            name: input.data.name,
            description: input.data.metadata.description,
            primary_contact_person: input.data.metadata.primary_contact_person,
            maintainer: input.data.metadata.maintainer,
            page: input.data.metadata.page,
            website: input.data.metadata.website
        },  
    }
}

