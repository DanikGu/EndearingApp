using System.Net;
using System.Net.NetworkInformation;
using System.Text;
using CliWrap;
using Npgsql;
using Xunit;

namespace EndearingApp.IntegrationTests;

public class TestDatabaseUpdateOperations : IDisposable
{
    private string containerName;
    private string firstDbName;
    private string secondDbName;
    private int port;
    private string containerId;

    public TestDatabaseUpdateOperations()
    {
        firstDbName = "postgres" + Guid.NewGuid().ToString().Replace("-", "");
        secondDbName = "postgres" + Guid.NewGuid().ToString().Replace("-", "");
        containerName = "postgres" + Guid.NewGuid().ToString().Replace("-", "");
        var outBuff = new StringBuilder();
        var errorBuff = new StringBuilder();
        port = GetEmptyPort();
        dockerCli
            .WithArguments(
                $"run --name {containerName} -e POSTGRES_PASSWORD=postgres -p {port}:5432 -d postgres"
            )
            .WithStandardOutputPipe(PipeTarget.ToStringBuilder(outBuff))
            .WithStandardErrorPipe(PipeTarget.ToStringBuilder(errorBuff))
            .ExecuteAsync()
            .GetAwaiter()
            .GetResult();
        containerId = outBuff.ToString().Replace("\n", "");
        CreateDatabase(firstDbName, port);
        CreateDatabase(secondDbName, port);
        InitFirstDb();
        InitSecondDb();
    }

    private Command dockerCli
    {
        get => Cli.Wrap("docker");
    }

    private void TestCleanup()
    {
        dockerCli
            .WithArguments("container stop " + containerId)
            .ExecuteAsync()
            .GetAwaiter()
            .GetResult();
        dockerCli
            .WithArguments("container rm " + containerId)
            .ExecuteAsync()
            .GetAwaiter()
            .GetResult();
    }

    //[Fact]
    private void TestMethod1()
    {
        //setup
        //var sourceSchemaConnStr = $"Host=localhost;Port={port};Database={secondDbName};Username=postgres;Password=postgres";
        //var targetSchemaConnStr = $"Host=localhost;Port={port};Database={firstDbName};Username=postgres;Password=postgres";
        //var builder = new PostgresDbStructureBuilder(sourceSchemaConnStr);
        //var targetBuilder = new PostgresDbStructureBuilder(targetSchemaConnStr);
        //var schema = builder.Build();
        //var targetSchema = targetBuilder.Build();
        //var checker = new DiffChecker(schema, targetSchema);
        //var actions = checker.GetActionsToAchiveTargetStructure();
        //
        ////act
        //var sqlGenerator = new PostgresSqlGenerator();
        //var resultSql = sqlGenerator.GenerateSqlFromActions(actions.ToArray());
        //using (var conn = new NpgsqlConnection(sourceSchemaConnStr))
        //{
        //  conn.Open();
        //
        //  using (var command = new NpgsqlCommand(resultSql, conn))
        //  {
        //    command.ExecuteNonQuery();
        //  }
        //
        //}
        //
        ////assert
        //builder = new PostgresDbStructureBuilder(sourceSchemaConnStr);
        //targetBuilder = new PostgresDbStructureBuilder(targetSchemaConnStr);
        //schema = builder.Build();
        //targetSchema = targetBuilder.Build();
        //checker = new DiffChecker(schema, targetSchema);
        //actions = checker.GetActionsToAchiveTargetStructure();
        //
        //Assert.False(actions.Any());
    }

    private int GetEmptyPort()
    {
        var currentPort = 5500;
        while (true)
        {
            if (!IsBusy(currentPort))
            {
                return currentPort;
            }
            currentPort++;
        }
    }

    bool IsBusy(int port)
    {
        IPGlobalProperties ipGP = IPGlobalProperties.GetIPGlobalProperties();
        IPEndPoint[] endpoints = ipGP.GetActiveTcpListeners();
        if (endpoints == null || endpoints.Length == 0)
            return false;
        for (int i = 0; i < endpoints.Length; i++)
            if (endpoints[i].Port == port)
                return true;
        return false;
    }

    private void CreateDatabase(string dbName, int port)
    {
        Thread.Sleep(1000);
        string connString =
            $"Host=localhost;Port={port};Username=postgres;Password=postgres;Database=postgres";
        using (var conn = new NpgsqlConnection(connString))
        {
            conn.Open();
            var sql = $"CREATE DATABASE {dbName}";

            using (var command = new NpgsqlCommand(sql, conn))
            {
                command.ExecuteNonQuery();
            }
        }
    }

    private void InitFirstDb()
    {
        string connString =
            $"Host=localhost;Port={port};Username=postgres;Password=postgres;Database={firstDbName}";
        using (var conn = new NpgsqlConnection(connString))
        {
            conn.Open();
            var sql = """
                              -- Users table (increased size for username and email)
              CREATE TABLE users (
                  user_id SERIAL PRIMARY KEY,
                  username VARCHAR(320) UNIQUE NOT NULL,
                  email VARCHAR(320) UNIQUE NOT NULL,
                  password VARCHAR(255) NOT NULL,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
              );
              -- Suppliers table
              CREATE TABLE suppliers (
                  supplier_id SERIAL PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  contact_name VARCHAR(255),
                  phone VARCHAR(20),
                  email VARCHAR(255),
                  address TEXT
              );

              -- Products table (added discount field)
              CREATE TABLE products (
                  product_id SERIAL PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  description TEXT,
                  price DECIMAL(10, 2) NOT NULL,
                  discount DECIMAL(10, 2) DEFAULT 0, -- New field for discount
                  stock_quantity INT NOT NULL,
                  supplier_id INT, -- New direct relationship to suppliers
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) -- New FK relationship
              );

              -- Categories table
              CREATE TABLE categories (
                  category_id SERIAL PRIMARY KEY,
                  name VARCHAR(255) UNIQUE NOT NULL,
                  description TEXT
              );

              -- Product Categories table (Many-to-Many relationship between Products and Categories)
              CREATE TABLE product_categories (
                  product_id INT NOT NULL,
                  category_id INT NOT NULL,
                  PRIMARY KEY (product_id, category_id),
                  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
                  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
              );

              -- Orders table (removed user_id FK relationship)
              CREATE TABLE orders (
                  order_id SERIAL PRIMARY KEY,
                  order_status VARCHAR(50) NOT NULL,
                  total_price DECIMAL(10, 2) NOT NULL,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
              );

              -- Order Items table
              CREATE TABLE order_items (
                  order_item_id SERIAL PRIMARY KEY,
                  order_id INT NOT NULL,
                  product_id INT NOT NULL,
                  quantity INT NOT NULL,
                  price DECIMAL(10, 2) NOT NULL,
                  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
              );

              -- Addresses table (Added 'address_type' field)
              CREATE TABLE addresses (
                  address_id SERIAL PRIMARY KEY,
                  user_id INT NOT NULL,
                  street VARCHAR(255) NOT NULL,
                  city VARCHAR(255) NOT NULL,
                  state VARCHAR(255),
                  country VARCHAR(255) NOT NULL,
                  zip_code VARCHAR(20),
                  address_type VARCHAR(50), -- New field to distinguish between billing and shipping addresses
                  FOREIGN KEY (user_id) REFERENCES users(user_id)
              );

              -- Payment Methods table
              CREATE TABLE payment_methods (
                  payment_method_id SERIAL PRIMARY KEY,
                  user_id INT NOT NULL,
                  card_number VARCHAR(255) NOT NULL,
                  expiration_date DATE NOT NULL,
                  cvv VARCHAR(3) NOT NULL,
                  FOREIGN KEY (user_id) REFERENCES users(user_id)
              );

              -- Reviews table
              CREATE TABLE reviews (
                  review_id SERIAL PRIMARY KEY,
                  product_id INT NOT NULL,
                  user_id INT NOT NULL,
                  rating INT NOT NULL,
                  comment TEXT,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
                  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
              );

              

              -- Inventory Logs table
              CREATE TABLE inventory_logs (
                  log_id SERIAL PRIMARY KEY,
                  product_id INT NOT NULL,
                  quantity_change INT NOT NULL,
                  change_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                  reason TEXT,
                  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
              );

              -- Wishlists table
              CREATE TABLE wishlists (
                  wishlist_id SERIAL PRIMARY KEY,
                  user_id INT NOT NULL,
                  name VARCHAR(255) NOT NULL,
                  FOREIGN KEY (user_id) REFERENCES users(user_id)
              );

              -- Wishlist Items table (Many-to-Many relationship between Wishlists and Products)
              CREATE TABLE wishlist_items (
                  wishlist_id INT NOT NULL,
                  product_id INT NOT NULL,
                  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (wishlist_id, product_id),
                  FOREIGN KEY (wishlist_id) REFERENCES wishlists(wishlist_id) ON DELETE CASCADE,
                  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
              );

              -- Shipping Information table (Removed address_id FK relationship for simplicity)
              CREATE TABLE shipping_info (
                  shipping_id SERIAL PRIMARY KEY,
                  order_id INT NOT NULL,
                  shipping_date TIMESTAMP WITH TIME ZONE,
                  estimated_arrival TIMESTAMP WITH TIME ZONE,
                  status VARCHAR(255) NOT NULL,
                  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
              );
              """;

            using (var command = new NpgsqlCommand(sql, conn))
            {
                command.ExecuteNonQuery();
            }
        }
    }

    private void InitSecondDb()
    {
        string connString =
            $"Host=localhost;Port={port};Username=postgres;Password=postgres;Database={secondDbName}";
        using (var conn = new NpgsqlConnection(connString))
        {
            conn.Open();
            var sql = """
                                      -- Users table
                  CREATE TABLE users (
                      user_id SERIAL PRIMARY KEY,
                      username VARCHAR(255) UNIQUE NOT NULL,
                      email VARCHAR(255) UNIQUE NOT NULL,
                      password VARCHAR(255) NOT NULL,
                      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                  );

                  -- Products table
                  CREATE TABLE products (
                      product_id SERIAL PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      description TEXT,
                      price DECIMAL(10, 2) NOT NULL,
                      stock_quantity INT NOT NULL,
                      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                  );

                  -- Categories table
                  CREATE TABLE categories (
                      category_id SERIAL PRIMARY KEY,
                      name VARCHAR(255) UNIQUE NOT NULL,
                      description TEXT
                  );

                  -- Product Categories table (Many-to-Many relationship between Products and Categories)
                  CREATE TABLE product_categories (
                      product_id INT NOT NULL,
                      category_id INT NOT NULL,
                      PRIMARY KEY (product_id, category_id),
                      FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
                      FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
                  );

                  -- Orders table
                  CREATE TABLE orders (
                      order_id SERIAL PRIMARY KEY,
                      user_id INT NOT NULL,
                      order_status VARCHAR(50) NOT NULL,
                      total_price DECIMAL(10, 2) NOT NULL,
                      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (user_id) REFERENCES users(user_id)
                  );

                  -- Order Items table
                  CREATE TABLE order_items (
                      order_item_id SERIAL PRIMARY KEY,
                      order_id INT NOT NULL,
                      product_id INT NOT NULL,
                      quantity INT NOT NULL,
                      price DECIMAL(10, 2) NOT NULL,
                      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                      FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
                  );

                  -- Addresses table
                  CREATE TABLE addresses (
                      address_id SERIAL PRIMARY KEY,
                      user_id INT NOT NULL,
                      street VARCHAR(255) NOT NULL,
                      city VARCHAR(255) NOT NULL,
                      state VARCHAR(255),
                      country VARCHAR(255) NOT NULL,
                      zip_code VARCHAR(20),
                      FOREIGN KEY (user_id) REFERENCES users(user_id)
                  );

                  -- Payment Methods table
                  CREATE TABLE payment_methods (
                      payment_method_id SERIAL PRIMARY KEY,
                      user_id INT NOT NULL,
                      card_number VARCHAR(255) NOT NULL,
                      expiration_date DATE NOT NULL,
                      cvv VARCHAR(3) NOT NULL,
                      FOREIGN KEY (user_id) REFERENCES users(user_id)
                  );

                  -- Reviews table
                  CREATE TABLE reviews (
                      review_id SERIAL PRIMARY KEY,
                      product_id INT NOT NULL,
                      user_id INT NOT NULL,
                      rating INT NOT NULL,
                      comment TEXT,
                      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
                      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
                  );

                  -- Suppliers table
                  CREATE TABLE suppliers (
                      supplier_id SERIAL PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      contact_name VARCHAR(255),
                      phone VARCHAR(20),
                      email VARCHAR(255),
                      address TEXT
                  );

                  -- Product Suppliers table (Many-to-Many relationship between Products and Suppliers)
                  CREATE TABLE product_suppliers (
                      product_id INT NOT NULL,
                      supplier_id INT NOT NULL,
                      PRIMARY KEY (product_id, supplier_id),
                      FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
                      FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
                  );

                  -- Inventory Logs table
                  CREATE TABLE inventory_logs (
                      log_id SERIAL PRIMARY KEY,
                      product_id INT NOT NULL,
                      quantity_change INT NOT NULL,
                      change_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                      reason TEXT,
                      FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
                  );

                  -- Wishlists table
                  CREATE TABLE wishlists (
                      wishlist_id SERIAL PRIMARY KEY,
                      user_id INT NOT NULL,
                      name VARCHAR(255) NOT NULL,
                      FOREIGN KEY (user_id) REFERENCES users(user_id)
                  );

                  -- Wishlist Items table (Many-to-Many relationship between Wishlists and Products)
                  CREATE TABLE wishlist_items (
                      wishlist_id INT NOT NULL,
                      product_id INT NOT NULL,
                      added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                      PRIMARY KEY (wishlist_id, product_id),
                      FOREIGN KEY (wishlist_id) REFERENCES wishlists(wishlist_id) ON DELETE CASCADE,
                      FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
                  );

                  -- Shipping Information table
                  CREATE TABLE shipping_info (
                      shipping_id SERIAL PRIMARY KEY,
                      order_id INT NOT NULL,
                      address_id INT NOT NULL,
                      shipping_date TIMESTAMP WITH TIME ZONE,
                      estimated_arrival TIMESTAMP WITH TIME ZONE,
                      status VARCHAR(255) NOT NULL,
                      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                      FOREIGN KEY (address_id) REFERENCES addresses(address_id) ON DELETE RESTRICT
                  );
                  
                  """;

            using (var command = new NpgsqlCommand(sql, conn))
            {
                command.ExecuteNonQuery();
            }
        }
    }

    public void Dispose()
    {
        TestCleanup();
    }
}
