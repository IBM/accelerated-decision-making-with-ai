import numpy as np


class Switcher(object):
    """A Switch case class that directly scores the WNTRAC data

    Args:
        object (_type_): _description_
    """

    def indirect(self, ident: str, value):
        method_name = str(ident.lower())
        method = getattr(self, method_name, lambda: "Invalid")
        return method(value)

    def i1(self, value):
        if value == "na" or value == np.nan or int(value) <= 10 or value == "":
            return 4
        elif 100 >= int(value) > 10:
            return 3
        elif 1000 >= int(value) > 100:
            return 2
        elif int(value) < 1000:
            return 1
        else:
            return 0

    def i2(self, value):
        if (
            value == "Partial cancellation of routes/stops during the week/weekend"
            or value == "na"
            or value == ""
        ):
            return 1
        elif (
            value
            == "Total cancellation of transport (special case for some states in China)"
        ):
            return 2
        else:
            return 0

    def i3(self, value):
        if value == "all":
            return 2
        elif value is None:
            return 0
        else:
            return 1

    def i4(self, value):
        if value == "all":
            return 2
        elif value is None:
            return 0
        else:
            return 1

    def i5(self, value):
        if value == "all":
            return 2
        elif value is None:
            return 0
        else:
            return 1

    def i6(self, value):
        if (
            value == "Suggestion to work from home for non-essential workers"
            or value == "na"
            or value == ""
        ):
            return 1
        elif value == "Mandatory work from home enforcement for non-essential workers":
            return 2
        else:
            return 0

    def i7(self, value):
        if (
            value == "Mandatory/advised for people at risk"
            or value == "na"
            or value == ""
        ):
            return 1
        elif value == "Mandatory/advisedfor all the population":
            return 2
        else:
            return 0

    def i8(self, value):
        if value == "all":
            return 2
        elif value is None:
            return 0
        else:
            return 1

    def a1(self, value):
        if value == "All schools (general) closed":
            return 2
        elif value is None:
            return 0
        else:
            return 1

    def a2(self, value):
        if value == "all":
            return 2
        elif value is None:
            return 0
        else:
            return 1

    def a3(self, value):
        if value == "all":
            return 2
        elif value is None:
            return 0
        else:
            return 1

    def h1(self, value):
        if value == "Mandatory":
            return 3
        elif value == "Mandatory in some public spaces":
            return 2
        elif value in ["Recommended", "na", "other"]:
            return 2
        else:
            return 0

    def targeted(self, value):
        if value == "na":
            return 1
        elif len(value) > 0:
            return 0
        else:
            return 1
