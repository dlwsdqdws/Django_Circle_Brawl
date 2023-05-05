class ChatField {
    constructor(playground) {
        this.playground = playground;

        // history box
        this.$history = $(`
            <div class="ball-game-chat-field-history">
            </div>
           `);

        // input box
        this.$input = $(`
            <input type="text" class="ball-game-chat-field-input">
            `);

        this.$history.hide();
        this.$input.hide();
        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start() {
        // this.add_listening_events();
    }

    add_listening_events() {
    }

    show_input() {
        this.show_history();
        this.$input.show();
        this.$input.focus()
    }

    hide_input() {
        this.$input.hide();
        // return focus to game_map
        this.playground.game_map.$canvas.focus();
    }
}
