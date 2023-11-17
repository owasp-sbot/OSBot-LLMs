export default class Data__Chat_Bot {
    constructor () {
        this.system_prompts = []
        this.user_messages  = []
    }

    add_user_message(message, type){
        const user_message = {message:message, type: type}
        this.user_messages.push(user_message)
        return this
    }

    add_user_message_sent(message) {
        return this.add_user_message(message, 'sent')
    }

    add_user_message_received(message) {
        return this.add_user_message(message, 'received')
    }

    add_system_prompt(system_prompt) {
        this.system_prompts.push(system_prompt)
        return this
    }

    remove_user_message(message, type) {
        const index = this.user_messages.findIndex(user_message => user_message.message === message &&
                                                                   user_message.type    === type    );
        if (index > -1) {
            this.user_messages.splice(index, 1); }
        return this;
    }

    remove_system_prompt(system_prompt) {
        const index = this.system_prompts.indexOf(system_prompt);
        if (index > -1) {
            this.system_prompts.splice(index, 1); }
        return this;
    }
}