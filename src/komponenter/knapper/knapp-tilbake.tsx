import * as React from 'react';

const onClick = () => {
    window.history.back();
};

function KnappTilbake() {
    return (
        <a href="#" className="tilbakeknapp typo-element" onClick={onClick}>Tilbake</a>
    );
}

export default KnappTilbake;