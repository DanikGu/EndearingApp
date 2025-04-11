using Ardalis.Specification;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Specifications;

public class GetByNameSpec : Specification<OptionSetDefinition>
{
    public GetByNameSpec(string name)
    {
        Query.Where(x => x.Name == name).Include(x => x.Options);
    }
}
