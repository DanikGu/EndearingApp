using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ardalis.Specification;

namespace EndearingApp.Core.FormAggregate.Specifications;

public class GetByNameSpec : Specification<Form>
{
    public GetByNameSpec(string name)
    {
        Query.Where(x => x.Name == name);
    }
}
