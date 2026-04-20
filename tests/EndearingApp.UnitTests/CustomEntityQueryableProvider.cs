using System.Collections;
using System.Diagnostics;
using System.Linq;
using EndearingApp.Infrastructure.Data;
using EndearingApp.Infrastructure.Data.CustomDataAccess;
using Xunit;

namespace EndearingApp.UnitTests;

public class Test
{
    [Fact]
    public void CI_ShouldPass_WhenTestIsCorrect()
    {
        // Arrange
        int expected = 11;
        int a = 5;
        int b = 5;

        // Act
        int actual = a + b;


        Assert.Equal(expected, actual);
    }
}

