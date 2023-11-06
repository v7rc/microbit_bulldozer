let TankP1 = 0
let TankP0 = 0
let BLEString = ""
bluetooth.startUartService()
let P0String = "1500"
let P1String = "1500"
let P2String = "1500"
let POValue = parseFloat(P0String)
let P1Value = parseFloat(P1String)
let P2Value = parseFloat(P2String)
servos.P0.setPulse(POValue)
servos.P1.setPulse(P1Value)
servos.P2.setPulse(P2Value)
basic.showLeds(`
    . . . . .
    . . . . .
    # . . . #
    . # . # .
    . . . . .
    `)
basic.forever(function () {
    BLEString = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
    if (BLEString.length == 19) {
        if (BLEString.substr(0, 3) == "SRT") {
            P0String = BLEString.substr(3, 4)
            P1String = BLEString.substr(7, 4)
            P2String = BLEString.substr(11, 4)
            POValue = parseFloat(P0String)
            P1Value = parseFloat(P1String)
            P2Value = parseFloat(P2String)
            TankP0 = 1500
            TankP1 = 1500
            if (P1Value >= 1500) {
                TankP1 = TankP1 + (P1Value - 1500)
                TankP0 = TankP0 - (P1Value - 1500)
            } else {
                TankP1 = TankP1 - (1500 - P1Value)
                TankP0 = TankP0 + (1500 - P1Value)
            }
            if (POValue >= 1500) {
                TankP1 = TankP1 + (POValue - 1500)
                TankP0 = TankP0 + (POValue - 1500)
            } else {
                TankP1 = TankP1 - (1500 - POValue)
                TankP0 = TankP0 - (1500 - POValue)
            }
            BLEString = ""
            servos.P0.setPulse(TankP0)
            servos.P1.setPulse(TankP1)
            servos.P2.setPulse(P2Value)
        } else {
            basic.showLeds(`
                . . . . .
                . . . . .
                # # . # #
                . . . . .
                . . . . .
                `)
            bluetooth.uartWriteString(BLEString)
            BLEString = ""
        }
    } else {
        bluetooth.uartWriteNumber(BLEString.length)
        BLEString = ""
    }
})
