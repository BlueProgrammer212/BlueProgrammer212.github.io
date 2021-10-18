export interface Fragment {
    template_id : string,
    template_element: any,
    image_upload: any,
    comment_message: any,
    defaultPfp: String,
    pfp_element: any
}

export interface FragmentExtension {
    readonly parent: any,
}

export interface Data {
     message: string;
     pfp_link: string;
     name: string; 
}