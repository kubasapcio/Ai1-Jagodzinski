interface AppState {
    currentTheme: string;
    themes: { [key: string]: string };
}

const state: AppState = {
    currentTheme: 'Jasny',
    themes: {
        'Jasny': '/styl1.css',
        'Ciemny': '/styl2.css',
        'Zielony': '/styl3.css'
    }
};

const updateStyle = (themeName: string): void => {
    const oldLink = document.getElementById('main-style');
    if (oldLink) {
        oldLink.remove();
    }

    const newLink = document.createElement('link');
    newLink.id = 'main-style';
    newLink.rel = 'stylesheet';
    newLink.href = state.themes[themeName];
    document.head.appendChild(newLink);
    
    state.currentTheme = themeName;
};

const renderControls = (): void => {
    const container = document.getElementById('style-controls');
    if (!container) return;

    container.innerHTML = '';

    Object.keys(state.themes).forEach(themeName => {
        const button = document.createElement('button');
        button.textContent = `Włącz styl: ${themeName}`;
        button.addEventListener('click', () => updateStyle(themeName));
        container.appendChild(button);
    });
};

document.addEventListener('DOMContentLoaded', renderControls);