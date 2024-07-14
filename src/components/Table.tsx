import React from 'react';

interface TableProps { }

/**
 * Table component.
 *
 * @author Björn Hempel <bjoern@hempel.li>
 * @version 0.1.0 (2024-07-14)
 * @since 0.1.0 (2024-07-14) First version.
 */
const Table: React.FC<TableProps> = ({}) => {

    const data = [
        { technologie: 'Kohlekraftwerke', vorteile: 'Hohe Energieausbeute, kostengünstig, etablierte Infrastruktur', nachteile: 'Hohe CO₂-Emissionen, Luftverschmutzung, erhebliche Umweltzerstörung durch Abbau', umweltscore: 2, verfuegbarkeit: 9 },
        { technologie: 'Erdgas-Kraftwerke', vorteile: 'Weniger CO₂-Emissionen als Kohle, flexibel und schnell hoch- und runterfahrbar', nachteile: 'Immer noch CO₂-Emissionen, Abhängigkeit von fossilen Brennstoffen', umweltscore: 4, verfuegbarkeit: 8 },
        { technologie: 'Kernkraftwerke', vorteile: 'Sehr niedrige CO₂-Emissionen, hohe Energieausbeute', nachteile: 'Radioaktiver Abfall, Risiko von Unfällen, hohe Kosten für Bau und Rückbau', umweltscore: 5, verfuegbarkeit: 7 },
        { technologie: 'Wasserkraftwerke', vorteile: 'Keine CO₂-Emissionen, zuverlässige und konstante Energiequelle', nachteile: 'Eingriff in Flussökosysteme, Umsiedlung von Gemeinden, Fischwanderungen beeinträchtigt', umweltscore: 7, verfuegbarkeit: 7 },
        { technologie: 'Windkraft', vorteile: 'Keine CO₂-Emissionen, erneuerbare Energiequelle', nachteile: 'Unregelmäßige Energieerzeugung, visuelle und akustische Beeinträchtigungen, Vogel- und Fledermaussterben', umweltscore: 8, verfuegbarkeit: 5 },
        { technologie: 'Solarenergie', vorteile: 'Keine CO₂-Emissionen, erneuerbare Energiequelle', nachteile: 'Unregelmäßige Energieerzeugung, hoher Platzbedarf, Herstellung von PV-Paneelen erfordert Ressourcen', umweltscore: 8, verfuegbarkeit: 5 },
        { technologie: 'Geothermie', vorteile: 'Zuverlässige und konstante Energiequelle, geringe CO₂-Emissionen', nachteile: 'Begrenzte Standorte, potenziell Erdbebenrisiko', umweltscore: 7, verfuegbarkeit: 4 },
        { technologie: 'Biomasse', vorteile: 'Nutzung von Abfallprodukten, CO₂-neutral wenn nachhaltig betrieben', nachteile: 'Emissionen von Feinstaub und anderen Schadstoffen, Nutzung landwirtschaftlicher Flächen', umweltscore: 5, verfuegbarkeit: 6 },
        { technologie: 'Meeresenergie (Wellen, Gezeiten)', vorteile: 'Erneuerbare Energiequelle, hohe Energiepotenziale', nachteile: 'Technologisch noch in den Kinderschuhen, Eingriff in Meeresökosysteme', umweltscore: 6, verfuegbarkeit: 3 },
        { technologie: 'Wasserstoff (Brennstoffzellen)', vorteile: 'Hohe Energieausbeute, keine direkten Emissionen', nachteile: 'Hoher Energieaufwand für Produktion, Infrastruktur noch unzureichend', umweltscore: 6, verfuegbarkeit: 4 },
    ];

    return (
        <>
            <h2 className="title-2">Energieerzeugung</h2>
            <p>Vorteile/Nachteile Energieerzeugung.</p>
            <table className="table table-striped table-hover table-bordered">
                <thead>
                <tr>
                    <th>Technologie</th>
                    <th>Vorteile</th>
                    <th>Nachteile</th>
                    <th>Umweltscore</th>
                    <th>Verfügbarkeit</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.technologie}</td>
                        <td>{item.vorteile}</td>
                        <td>{item.nachteile}</td>
                        <td>{item.umweltscore}</td>
                        <td>{item.verfuegbarkeit}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default Table;
