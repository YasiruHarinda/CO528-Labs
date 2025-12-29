import * as dmUtils from "./dm-utils";
declare var DM_PROPERTIES: any;

/*
* title : "root",
* inputType : "JSON",
*/
interface Root {
    "Accelerated and High-Performance Computing (FPGA / GPU)": {
        title: string
        venue: string
        year: string
        abstract: string
        authors: string[]
        author_info: {
            name: string
            profile: string
            type: string
            id: string
            email: string
            profile_image: string
            profile_url: string
        }[]
        doi: string
        is_dept_affiliated: boolean
        preprint: string
        pdf: string
        presentation: string
        project: string
        codebase: string
        researchgroups: string[]
        funding: string
        tags: string[]
        api_url: string
        edit_url: string
    }[]
    "Computational BioEngineering": {
        title: string
        venue: string
        year: string
        abstract: string
        authors: string[]
        author_info: {
            name: string
            profile: string
            type: string
            id: string
            email: string
            profile_image: string
            profile_url: string
        }[]
        doi: string
        is_dept_affiliated: boolean
        preprint: string
        pdf: string
        presentation: string
        project: string
        codebase: string
        researchgroups: string[]
        funding: string
        tags: string[]
        api_url: string
        edit_url: string
    }[]
    "Computer Vision": {
        title: string
        venue: string
        year: string
        abstract: string
        authors: string[]
        author_info: {
            name: string
            profile: string
            type: string
            id: string
            email: string
            profile_image: string
            profile_url: string
        }[]
        doi: string
        is_dept_affiliated: boolean
        preprint: string
        pdf: string
        presentation: string
        project: string
        codebase: string
        researchgroups: string[]
        funding: string
        tags: string[]
        api_url: string
        edit_url: string
    }[]
    "ESCAL_ Computer Systems (Embedded Systems / Robotics )": {
        title: string
        venue: string
        year: string
        abstract: string
        authors: string[]
        author_info: {
            name: string
            profile: string
            type: string
            id: string
            email: string
            profile_image: string
            profile_url: string
        }[]
        doi: string
        is_dept_affiliated: boolean
        preprint: string
        pdf: string
        presentation: string
        project: string
        codebase: string
        researchgroups: string[]
        funding: string
        tags: string[]
        api_url: string
        edit_url: string
    }[]
    "Machine Learning and Data Mining": {
        title: string
        venue: string
        year: string
        abstract: string
        authors: string[]
        author_info: {
            name: string
            profile: string
            type: string
            id: string
            email: string
            profile_image: string
            profile_url: string
        }[]
        doi: string
        is_dept_affiliated: boolean
        preprint: string
        pdf: string
        presentation: string
        project: string
        codebase: string
        researchgroups: string[]
        funding: string
        tags: string[]
        api_url: string
        edit_url: string
    }[]
    "Nextgen Networks": {
        title: string
        venue: string
        year: string
        abstract: string
        authors: string[]
        author_info: {
            name: string
            profile: string
            type: string
            id: string
            email: string
            profile_image: string
            profile_url: string
        }[]
        doi: string
        is_dept_affiliated: boolean
        preprint: string
        pdf: string
        presentation: string
        project: string
        codebase: string
        researchgroups: string[]
        funding: string
        tags: string[]
        api_url: string
        edit_url: string
    }[]
    "Secure and Reliable Computing (Formal Verification / Cryptography / Blockchain)": {
        title: string
        venue: string
        year: string
        abstract: string
        authors: string[]
        author_info: {
            name: string
            profile: string
            type: string
            id: string
            email: string
            profile_image: string
            profile_url: string
        }[]
        doi: string
        is_dept_affiliated: boolean
        preprint: string
        pdf: string
        presentation: string
        project: string
        codebase: string
        researchgroups: string[]
        funding: string
        tags: string[]
        api_url: string
        edit_url: string
    }[]
    "Smart and Intelligent Systems (IoT / AI / Wearable Computing)": {
        title: string
        venue: string
        year: string
        abstract: string
        authors: string[]
        author_info: {
            name: string
            profile: string
            type: string
            id: string
            email: string
            profile_image: string
            profile_url: string
        }[]
        doi: string
        is_dept_affiliated: boolean
        preprint: string
        pdf: string
        presentation: string
        project: string
        codebase: string
        researchgroups: string[]
        funding: string
        tags: string[]
        api_url: string
        edit_url: string
    }[]
}

/*
* title : "root",
* outputType : "JSON",
*/
interface OutputRoot {
    response: string
    metadata: {
        count: number
    }
    data: unknown[]
}



/**
 * functionName : map_S_root_S_root
 * inputVariable : inputroot
*/
export function mapFunction(input: Root): OutputRoot {
    return {
        data: input["Computer Vision"],
        metadata: {
            count: mapPublicationCount(input["Computer Vision"])
        },
        response: "success"
    }
}

function mapPublicationCount(input: Root["Computer Vision"]): any {
    return input.length;
}
