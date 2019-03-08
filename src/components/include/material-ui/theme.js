import {createMuiTheme} from 'material-ui-next/styles';

// adopted from: https://material-ui-next.com/customization/themes/#theme-configuration-variables
const DarkThemeConfig = {
    palette: {
        // Switching the dark mode on is a single property value change.
        type: 'dark',
    },
    typography: {
        // Tell Material-UI what's the font-size on the html element is.
        htmlFontSize: 12,
    },
    overrides: {
        MuiFormControl: {
            root: {
                margin: 10,
                minWidth: 120,
            }
        }
    }
};

export const DarkMaterialUITheme = createMuiTheme(DarkThemeConfig);

export const LightMaterialUITheme = createMuiTheme({
    typography: DarkThemeConfig.typography,
    palette: {
        type: 'light',
    },
});
