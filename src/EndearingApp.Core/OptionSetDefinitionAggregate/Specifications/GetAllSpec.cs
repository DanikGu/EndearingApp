using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ardalis.Specification;

namespace EndearingApp.Core.OptionSetDefinitionAggregate.Specifications;

public class GetAllSpec : Specification<OptionSetDefinition>
{
    public GetAllSpec()
    {
        Query.Include(x => x.Options);
    }
}
