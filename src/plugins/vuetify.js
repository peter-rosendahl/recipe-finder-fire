import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { mdi } from 'vuetify/iconsets/mdi';
import "@mdi/font/css/materialdesignicons.css";
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VIcon } from 'vuetify/components';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { VFooter } from 'vuetify/components';
import colors from 'vuetify/lib/util/colors.mjs';

const darkTheme = {
    dark: true,
    colors: {
        background: "#efefef",
        success: colors.lightGreen.accent1,
        black: "#333333",
        driftwood: "#978476", 
        taupe: "#978476",
        babyblue: "#6badc1",
        darkgreen: colors.lightGreen.darken4,
        lightgreen: colors.lightGreen.accent3
    }
}

const lightTheme = {
    dark: false,
    colors: {
        background: "#ffffff",
        black: "#333333",
        driftwood: "#978476", 
        lightgreen: "rgba(255,253,208,1)",
        taupe: "#978476",
        babyblue: "#6badc1",
    }
}

export const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi',
        sets: {
            mdi,
        }
    },
    components: {
        ...components,
        VFooter,
        VDataTable,
        VIcon
    },
    directives,
    defaults: {
        icons: 'mdiSvg',
        theme: 'dark'
    },
    theme: {
        defaultTheme: "lightTheme",
        themes: {
            darkTheme,
            lightTheme
        }
        // themes: {
        //     light: {
        //       primary: colors.lightBlue,
        //       secondary: colors.grey.darken1,
        //       success: colors.green.accent2,
        //       accent: colors.pink.darken1,
        //       error: colors.red.accent3,
        //       background: colors.indigo.lighten5,
        //       info: colors.teal.darken1,
        //     },
        //     dark: {
        //       primary: colors.blue.darken4,
        //       background: colors.indigo.base,
        //       info: colors.teal.lighten1,
        //       success: colors.amber
        //     },
        // }
    }
});