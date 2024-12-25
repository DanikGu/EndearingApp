using EndearingApp.Core.CustomEntityAggregate.DbStructureModels;
using EndearingApp.Core.CustomEntityAggregate.Events;
using EndearingApp.SharedKernel.Interfaces;
using MediatR;

namespace EndearingApp.Core.CustomEntityAggregate.Handlers
{
    public class CustomEntityCreatesHandler : INotificationHandler<CustomEntityCreated>
    {
        private readonly IRepository<CustomEntity> _customEntityRepository;

        public CustomEntityCreatesHandler(IRepository<CustomEntity> customEntityRepository)
        {
            _customEntityRepository = customEntityRepository;
        }

        public async Task Handle(
            CustomEntityCreated notification,
            CancellationToken cancellationToken
        )
        {
            var etn = await _customEntityRepository.GetByIdAsync(notification.Id);
            if (etn is null)
            {
                throw new InvalidOperationException("Event fired for entity that don't exists");
            }
            AddSystemFields(etn);
            await _customEntityRepository.SaveChangesAsync();
        }

        // This method adds fields that will be read-only for the user
        // but will be part of every custom entity record. Essentially,
        // we define the base model for entities
        //
        // These fields are ignored when EF Core models are generated
        // in DatabaseStructureUpdater.cs, because they are currently
        // hardcoded there. And this field have IsSystemField flag setted to true
        //
        // The base entity looks like this:
        //
        // public Guid Id { get; set; }
        // public DateTime CreatedOn { get; set; }
        // public DateTime ModifiedOn { get; set; }
        //
        private void AddSystemFields(CustomEntity etn)
        {
            var fields = etn.Fields.ToList();

            fields.Add(
                new Field()
                {
                    Name = "Id",
                    DisplayName = "Id",
                    Type = SystemTypesEnum.UUID,
                    Description = "Primary Key",
                    IsPrimaryKey = true,
                    IsSystemField = true,
                    IsNullable = false,
                    CustomEntityId = etn.Id,
                }
            );
            fields.Add(
                new Field()
                {
                    Name = "CreatedOn",
                    DisplayName = " Created on",
                    Type = SystemTypesEnum.Timestamp,
                    Description = "Time when record was created",
                    IsPrimaryKey = false,
                    IsSystemField = true,
                    IsNullable = false,
                    CustomEntityId = etn.Id,
                }
            );
            fields.Add(
                new Field()
                {
                    Name = "ModifiedOn",
                    DisplayName = "Modified on",
                    Type = SystemTypesEnum.Timestamp,
                    Description = "Time when record was modidifed",
                    IsPrimaryKey = false,
                    IsSystemField = true,
                    IsNullable = false,
                    CustomEntityId = etn.Id,
                }
            );
            var chnageSet = new CustomEntity(etn.Id, etn.Name, fields, etn.Relationships.ToList());
            etn.UpdateCustomeEntity(chnageSet);
        }
    }
}
