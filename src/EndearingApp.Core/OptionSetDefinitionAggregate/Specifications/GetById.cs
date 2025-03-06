using Ardalis.Specification;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Specifications;
public class GetById : Specification<OptionSetDefinition>
{
    public GetById(Guid id)
    {
        Query.Where(x => x.Id == id).Include(x => x.Options);
    }
}
