// Konfiguration för varje kurs. Lägg till en ny kurs genom att lägga till
// en post här – ingen annan kod behöver ändras.
//
// Nyckeln (t.ex. "historia") används i URL:en som ?kurs=historia
// sheetId/gid pekar ut vilket Google Sheet och vilken flik kursens data ligger i.
const COURSES = {
    historia: {
        label: 'Historia vårterminen 2026',
        headerTitle: '📖 Historia våren 2026',
        pageTitle: 'Historia våren 2026 – Planering',
        intro: [
            'Det här är planeringen för vårterminens moment i Historia. Klicka på ett moment i menyn för att se veckoplanering, sidor och uppgifter.',
            'Normalt läser vi sex moment, men i år har vi anpassat till fem för att ge mer tid åt varje område.'
        ],
        sheetId: '1g0LdKubDtT8Uz5KfTuf0J8Z7jFUSS6uf63rvCravqCo',
        gid: '0'
    }

    // Exempel på hur en ny kurs läggs till:
    // samhallskunskap: {
    //     label: 'Samhällskunskap vårterminen 2026',
    //     headerTitle: '🏛️ Samhällskunskap våren 2026',
    //     pageTitle: 'Samhällskunskap våren 2026 – Planering',
    //     intro: [
    //         'Planering för vårterminens moment i Samhällskunskap.'
    //     ],
    //     sheetId: 'KLISTRA_IN_SHEET_ID_HÄR',
    //     gid: '0'
    // }
};

const DEFAULT_COURSE = 'historia';
