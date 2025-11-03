import React from 'react'

export default function Topbar({ onExport }) {
    return (
        <header className='topbar'>
            <h1>Dashboard de Envíos</h1>
            <div className='topbar-actions'>
                <buton className='btn' onClick={onExport}>Exportar CSV</buton>
                <a className='btn outline' href='https://recharts.org/en-US" target="_blank" rel="noreferrer">Recharts Docs'></a>
            </div>
        </header>
    )
}