<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Slip Gaji - {{ $slipGaji->karyawan->nama }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            padding: 30px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
        }

        .header h1 {
            font-size: 24px;
            color: #1e40af;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 11px;
            color: #666;
        }

        .info-section {
            margin-bottom: 25px;
        }

        .info-table {
            width: 100%;
            margin-bottom: 20px;
        }

        .info-table td {
            padding: 8px 0;
        }

        .info-table td:first-child {
            width: 150px;
            font-weight: bold;
            color: #555;
        }

        .salary-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .salary-table th {
            background-color: #2563eb;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }

        .salary-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
        }

        .salary-table tr:last-child td {
            border-bottom: none;
        }

        .salary-table .label {
            font-weight: 500;
            color: #555;
        }

        .salary-table .amount {
            text-align: right;
            font-weight: bold;
            color: #1e40af;
        }

        .total-row {
            background-color: #dbeafe;
            font-weight: bold;
        }

        .total-row td {
            padding: 15px 12px !important;
            font-size: 14px;
        }

        .total-row .amount {
            color: #1e40af;
            font-size: 16px;
        }

        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }

        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
        }

        .signature-box {
            text-align: center;
            width: 200px;
        }

        .signature-line {
            margin-top: 60px;
            border-top: 1px solid #333;
            padding-top: 5px;
        }

        .print-date {
            text-align: right;
            color: #666;
            font-size: 10px;
            margin-top: 30px;
        }

        .period-badge {
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
            padding: 5px 15px;
            border-radius: 5px;
            font-weight: bold;
            margin-bottom: 10px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>SLIP GAJI KARYAWAN</h1>
        <p>Sistem Informasi Keuangan</p>
    </div>

    <div class="info-section">
        <table class="info-table">
            <tr>
                <td>Nama Karyawan</td>
                <td>: {{ $slipGaji->karyawan->nama }}</td>
            </tr>
            <tr>
                <td>Jabatan</td>
                <td>: {{ $slipGaji->karyawan->jabatan }}</td>
            </tr>
            <tr>
                <td>Periode</td>
                <td>: {{ \Carbon\Carbon::parse($slipGaji->periode . '-01')->format('F Y') }}</td>
            </tr>
            <tr>
                <td>Tanggal Cetak</td>
                <td>: {{ \Carbon\Carbon::now()->format('d F Y') }}</td>
            </tr>
        </table>
    </div>

    <table class="salary-table">
        <thead>
            <tr>
                <th>Keterangan</th>
                <th style="text-align: right;">Jumlah (Rp)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="label">Gaji Pokok</td>
                <td class="amount">{{ number_format($slipGaji->gaji_pokok, 0, ',', '.') }}</td>
            </tr>
            @if($slipGaji->tunjangan > 0)
            <tr>
                <td class="label">Tunjangan</td>
                <td class="amount">{{ number_format($slipGaji->tunjangan, 0, ',', '.') }}</td>
            </tr>
            @endif
            @if($slipGaji->potongan > 0)
            <tr>
                <td class="label">Potongan</td>
                <td class="amount" style="color: #dc2626;">-{{ number_format($slipGaji->potongan, 0, ',', '.') }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td class="label">TOTAL GAJI BERSIH</td>
                <td class="amount">{{ number_format($slipGaji->gaji_bersih, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <div style="display: table; width: 100%; margin-top: 40px;">
            <div style="display: table-cell; width: 50%; text-align: center;">
                <p>Penerima,</p>
                <div class="signature-line">
                    {{ $slipGaji->karyawan->nama }}
                </div>
            </div>
            <div style="display: table-cell; width: 50%; text-align: center;">
                <p>Mengetahui,</p>
                <div class="signature-line">
                    ( ........................... )
                </div>
            </div>
        </div>

        <div class="print-date">
            Dicetak pada: {{ \Carbon\Carbon::now()->format('d F Y H:i') }} WIB
        </div>
    </div>
</body>

</html>