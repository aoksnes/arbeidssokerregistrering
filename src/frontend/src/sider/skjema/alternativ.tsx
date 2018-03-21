import * as React from 'react';
import { RadioPanel } from 'nav-frontend-skjema';
import InjectedIntlProps = ReactIntl.InjectedIntlProps;

interface AlternativProps {
    hentAvgittSvar: () => number | undefined;
    alternativId: number;
    avgiSvar: (alternativId: number) => void;
    getTekstId: (alternativId: number) => string;
}

function Alternativ(props: AlternativProps & InjectedIntlProps) {
    const tekst = props.intl.messages[props.getTekstId(props.alternativId)];
    return (
        <div className="alternativ-wrapper">
            <RadioPanel
                onChange={() => props.avgiSvar(props.alternativId)}
                className="blokk-xs"
                name={'alternativ'}
                label={tekst}
                value={tekst}
                checked={props.hentAvgittSvar() === props.alternativId}
            />
        </div>
    );
}

export default Alternativ;