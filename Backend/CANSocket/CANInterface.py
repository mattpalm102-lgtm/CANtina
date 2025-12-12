import can
import itertools

def connectDevice(type: str="peak", baud: int=250000, termination: bool = False) -> can.Bus:
    """
    Connect to a CAN device and return a python-can Bus object.

    Args:
        type (str): CAN interface type, e.g., "peak"
        baud (int): CAN bus bitrate
        termination (bool): Optional, reserved for future use

    Returns:
        can.Bus: python-can Bus object
    """
    if type.lower() == "peak":
        try:
            bus = can.interface.Bus(
                interface='pcan',
                channel='PCAN_USBBUS1',
                bitrate=baud
            )
            return bus
        except Exception as e:
            raise ConnectionError(f"Failed to connect to PEAK CAN device: {e}")
    #TODO: Add support for other CAN interface types here
    else:
        raise ValueError(f"Unsupported CAN interface type: {type}")
    
_toggle = itertools.cycle([False, True])

def messageStub():
    """
    Generate a stub CAN message for testing purposes.

    Returns:
        can.Message: A stub CAN message
    """
    toggle = next(_toggle)

    if toggle:
        msg = can.Message(
            arbitration_id=0x87654321,
            data=[0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88],
            is_extended_id=True
        )
    else:
        msg = can.Message(
            arbitration_id=0x12345678,
            data=[0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88],
            is_extended_id=True
        )

    return msg