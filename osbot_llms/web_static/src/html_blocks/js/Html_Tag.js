export default class Html_Tag {
    constructor(tagName, id=null) {
        this.styles   = this.default_styles(); // Ensure default_styles() method is defined in this class
        this.tag_name = tagName;
        this.id       = id || this.generate_random_id(); // Ensure generate_random_id() method is defined in this class
        this.elements = [];
    }

    generate_random_id() {
        const random_part = Math.random().toString(36).substring(2, 7); // Generate a random string.
        return `${this.tag_name.toLowerCase()}_${random_part}`;
    }
}