import can

def connectDevice(type: str="peak", baud: int=500000, termination: bool = False) -> can.Bus:
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
                channel='PCAN_USBBUS1',  # adjust as needed
                bitrate=baud
            )
            return bus
        except Exception as e:
            raise ConnectionError(f"Failed to connect to PEAK CAN device: {e}")
    #TODO: Add support for other CAN interface types here
    else:
        raise ValueError(f"Unsupported CAN interface type: {type}")