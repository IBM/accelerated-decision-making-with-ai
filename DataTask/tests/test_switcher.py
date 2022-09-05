import pytest

from switcher import Switcher


@pytest.fixture(scope="class")
def switcher():
    return Switcher()


@pytest.mark.usefixtures("switcher")
class TestSwitcher:
    def test_i1(self, value, switcher):
        val = switcher.i1(value)
        assert val is 0

    def test_i2(self, value, switcher):
        val = switcher.i2(value)
        assert val is 0

    def test_i3(self, value_2, switcher):
        val = switcher.i3(value_2)
        assert val is 2

    def test_i4(self, value_2, switcher):
        val = switcher.i4(value_2)
        assert val is 2

    def test_i5(self, value_2, switcher):
        val = switcher.i5(value_2)
        assert val is 2

    def test_i6(self, value, switcher):
        val = switcher.i6(value)
        assert val is 0

    def test_i7(self, value, switcher):
        val = switcher.i7(value)
        assert val is 0

    def test_i8(self, value_2, switcher):
        val = switcher.i8(value_2)
        assert val is 2

    def test_a1(self, value, switcher):
        val = switcher.a1(value)
        assert val is 1

    def test_a2(self, value, switcher):
        val = switcher.a2(value)
        assert val is 1

    def test_a3(self, value, switcher):
        val = switcher.a3(value)
        assert val is 1

    def test_h1(self, value, switcher):
        val = switcher.h1(value)
        assert val is 0

    def test_targeted(self, ident, switcher):
        val = switcher.targeted(ident)
        assert val is 0
