using System.Xml.Linq;
using Ardalis.Specification;

namespace EndearingApp.Core.SystemSettingsAggregate.Specifications;

public class GetByNameSpec : Specification<SystemSetting>
{
    public GetByNameSpec(string name)
    {
        Query.Where(x => x.Name == name);
    }
}
